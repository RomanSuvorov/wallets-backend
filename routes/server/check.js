module.exports = async (req, res) => {
  try {
    const { id } = req.session;
    return res.status(200).json({ sessionID: id, status: 200 });
  } catch (e) {
    res.status(500).json({ message: "Server Error in CHECK" });
  }
};
