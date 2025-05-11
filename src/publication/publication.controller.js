import Publication from "./publication.model.js";
import Comment from "../comment/comment.model.js";

export const savePublication = async (req, res) => {
  try {
    const data = req.body;
    const publication = new Publication({
      ...data,
    });

    await publication.save();

    res.status(200).json({
      success: true,
      publication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error saving Publication",
      error,
    });
  }
};

export const getPublications = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const [total, publications] = await Promise.all([
      Publication.countDocuments({ state: true }),
      Publication.find({ state: true })
        .skip(Number(offset))
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      total,
      posts: publications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error getting publications",
      error: error.message,
    });
  }
};

export const getPublicationsById = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await Publication.findById(id).sort({ createdAt: -1 });

    if (!publication) {
      return res.status(404).json({
        success: false,
        msg: "Publication not found",
      });
    }

    res.status(200).json({
      success: true,
      publication: publication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error getting publication",
      error: error.message,
    });
  }
};

export const updatePublication = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedPublication = await Publication.findByIdAndUpdate(
      id,
      { ...data },
      { new: true }
    );

    res.status(200).json({
      success: false,
      msg: "Post updated successfully",
      updatedPublication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating the publication",
      error: error.message,
    });
  }
};

export const deletePublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        msg: "Publication not found",
      });
    }

    await Comment.updateMany(
      { publication: publication.id },
      { $set: { state: false } }
    );

    const deletedPublication = await Publication.findByIdAndUpdate(
      publication.id,
      { state: false }
    );

    res.status(200).json({
      success: true,
      msg: "Publication and its comments deactivated successfully",
      deletedPublication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error deactivating the publication",
      error: error.message,
    });
  }
};

export const giveLikes = async (req, res) => {
  try {
    const { id } = req.params;

    const publication = await Publication.findById(id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        msg: "Publication not found",
      });
    }

    publication.likes += 1;
    await publication.save();

    res.status(200).json({
      success: true,
      msg: "Like added",
      totalLikes: publication.likes,
      publication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error adding like to the publication",
      error: error.message,
    });
  }
};

export const removelike = async (req, res) => {
  try {
    const { id } = req.params;

    const publication = await Publication.findById(id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        msg: "Publication not found",
      });
    }

    publication.likes -= 1;
    await publication.save();

    res.status(200).json({
      success: true,
      msg: "Like added",
      totalLikes: publication.likes,
      publication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error adding like to the publication",
      error: error.message,
    });
  }
};
