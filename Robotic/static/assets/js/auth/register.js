document.addEventListener('DOMContentLoaded', () => {
	const redirectConfig = window.registerRedirect;

	if (!redirectConfig || !redirectConfig.url || !redirectConfig.delay) {
		return;
	}

	const successMessage = document.querySelector('.form-message[data-state="success"]');

	if (!successMessage) {
		return;
	}

	window.setTimeout(() => {
		window.location.assign(redirectConfig.url);
	}, redirectConfig.delay);
});
