export function recaptchaElementNotEmpty(): boolean {
	const el = document.getElementById('robot_checkbox');

	if (el) {
		return el.children.length > 0;
	}

	return true;
}
