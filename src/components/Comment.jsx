const Comment = ({ setComment, data, styles }) => {
  const handleChange = (e) => {
    const value = e.currentTarget.value;
    setComment(value);
  }

  return (
    <div style={styles.inputContainer}>
      <p style={styles.labelContainer}><span style={styles.label}>Comment:</span></p>
      <input
        onChange={(e) => handleChange(e, "last")}
        value={data}
        placeholder="Comment"
        style={styles.inputField}
      />
    </div>
  )
}

export default Comment;