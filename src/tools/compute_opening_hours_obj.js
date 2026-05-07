export function compute_opening_hours_obj (oh_string) {
  try {
    const oh = new opening_hours(oh_string, null)
    return oh
  } catch (error) {
    return null
  }
}
