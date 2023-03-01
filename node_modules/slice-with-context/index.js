const clamp = (n, low, high) => Math.min(high, Math.max(low, n))
const sliceWithContext = (
  inputText, windowSize, offset, length,
  windowLeftBias = 0.5, overflowLeftBias = 0
) => {
  //
  // Process arguments
  //

  // Throw if the window doesn't hit the input text at all
  if (offset < 0) {
    throw RangeError('offset <0; implies window begins before beginning of string!')
  }
  if (offset + length > inputText.length) {
    throw RangeError('offset + length > inputString.length; implies window continues beyond end of string')
  }
  windowLeftBias = clamp(windowLeftBias, 0, 1)
  overflowLeftBias = clamp(overflowLeftBias, 0, 1)

  //
  // Main logic
  //

  const fullSlice = inputText.slice(offset, offset + length)

  const fitsInWindow = length <= windowSize
  if (fitsInWindow) {
    // Sliced part fits fully in the window.  Calculate space left over, and
    // distribute it according to windowLeftBias.

    const contextSpace = windowSize - length

    let leftContextLength = Math.min(
      // How much we want
      Math.floor(contextSpace * windowLeftBias),
      // How much space there actually is between the left edge and where the
      // slice begins
      offset
    )
    const rightContextLength = Math.min(
      // How much we want
      contextSpace - leftContextLength,
      // How much space there actually is between where the slice ends and the
      // right edge
      inputText.length - offset - length
    )
    // In case the right side turned out to have insufficient space, give the
    // rest back to the left.  We know this still fits.
    leftContextLength = contextSpace - rightContextLength

    const windowOffset = offset - leftContextLength
    const windowLength = length + leftContextLength + rightContextLength

    const windowPart = inputText.slice(
      windowOffset,
      windowOffset + windowLength)

    return {
      fit: true,
      withContext: windowPart,
      visibleSlice: windowPart.slice(
        leftContextLength, leftContextLength + length),
      fullSlice,
      position: {
        offset: leftContextLength,
        length: length
      }
    }
  } else {
    // The sliced part is too big to fit in the window.  We can forget about
    // showing any context, and just need to truncate the input to show the
    // correct part specified by overflowLeftBias.

    const truncationLength = windowSize
    const truncationOffset = Math.floor(
      (fullSlice.length - windowSize) * (1 - overflowLeftBias))
    const truncatedPart = fullSlice.slice(
      truncationOffset,
      truncationOffset + truncationLength)

    return {
      fit: false,
      withContext: truncatedPart,
      visibleSlice: truncatedPart,
      fullSlice,
      position: {
        offset: 0,
        length: windowSize
      }
    }
  }
}
module.exports = sliceWithContext
