import Publication from "../publication/publication.model.js";
import Comment from "./comment.model.js";

export const saveComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const data = req.body;

    const post = await Publication.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({
        success: false,
        msg: "publication not found",
      });
    }

    const comment = new Comment({
      ...data,
      publication: post.id,
    });

    await comment.save();
    post.comments.push(comment.id);
    await post.save();

    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error saving Publication",
      error: error.message,
    });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const [total, comments] = await Promise.all([
      Comment.countDocuments({ publication: postId, state: true }),
      Comment.find({ publication: postId, state: true })
        .skip(Number(offset))
        .limit(Number(limit)),
    ]);

    if (total === 0) {
      return res.status(200).json({
        success: true,
        total,
        comments: [],
        msg: "This post has no comments",
      });
    }

    res.status(200).json({
      success: true,
      comments: comments.map((comment) => ({
        content: comment.content,
        publicationTitle: comment.publication
          ? comment.publication.title
          : "No Title",
        author: comment.author,
        createdAt: comment.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error fetching comments",
      error: error.message,
    });
  }
};


export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        msg: "Comment not found",
      });
    }

    comment.content = content || comment.content;

    const updatedComment = await comment.save();

    res.status(200).json({
      success: true,
      msg: "Comment updated successfully",
      updatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error updating the comment",
      error: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        msg: "Comment not found",
      });
    }


    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );

    await Publication.findByIdAndUpdate(
      comment.publication.toString(),
      { $pull: { comments: id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      msg: "Comment removed successfully",
      updatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error deliting comment",
      error: error.message,
    });
  }
};
