// Copy text to the clipboard and flash the button label.
export async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    flash(button, "Copied ✓");
  } catch (_) {
    flash(button, "Copy failed");
  }
}

function flash(button, label) {
  if (!button) return;
  const old = button.dataset.label || button.textContent;
  button.dataset.label = old;
  button.textContent = label;
  setTimeout(() => (button.textContent = old), 1500);
}
