import { User } from "../models/userModel.js";

export const SaveToHistory = async (req, res) => {
  try {
    const { toolName, input } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.history.push({ toolName, input });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Saved to history",
    });

  } catch (error) {
    console.log("Error in saving to history :", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};


export const GetHistory = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized user!",
      });
    }

    const user = await User.findById(userId).select("history");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved",
      history: user.history,
    });
  } catch (error) {
    console.log("Error in retrieving history:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};



export const DeleteHistoryItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { historyId } = req.params; // ID of the history item to delete

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    // Filter out the history item
    const updatedHistory = user.history.filter(
      (item) => item._id.toString() !== historyId
    );

    user.history = updatedHistory;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "History entry deleted successfully!",
      updatedHistory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
