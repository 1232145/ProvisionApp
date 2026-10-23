const Comment = ({ setComment, data, styles }) => {
  const handleChange = (e) => {
    const value = e.currentTarget.value;
    setComment(value);
  }

  return (
    <div style={styles.inputContainer}>
      <label htmlFor="comment-field" style={styles.labelContainer}>
        <span style={styles.label}>Comment:</span>
      </label>
      <input
        id="comment-field"
        onChange={(e) => handleChange(e, "last")}
        value={data}
        placeholder="Comment"
        aria-label="Comment"
        style={styles.inputField}
      />
    </div>
  )
}

export default Comment;
