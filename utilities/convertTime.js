const convertDurationToMs = (expiry) => {
  try {
    const time = parseInt(expiry);
    if (expiry.endsWith("d")) return time * 24 * 60 * 60 * 1000;
    if (expiry.endsWith("h")) return time * 60 * 60 * 1000;
    if (expiry.endsWith("m")) return time * 60 * 1000;
  } catch (error) {
    console.log(`Error in converting time duration: ${error.message}`);
  }
};

export default convertDurationToMs;
