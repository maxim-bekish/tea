(function () {
	'use strict';

	const form = document.getElementById('buy-form');
	if (!form) return;

	const els = {
		inputs: form.querySelectorAll('.pack__input'),
		sku: document.querySelector('[data-sku]:not(input)'),
		price: form.querySelector('[data-price]:not(input)'),
		oldPrice: form.querySelector('[data-old-price]:not(input)'),
		priceMeta: form.querySelector('[data-price-meta]'),
		badge: document.querySelector('[data-discount]'),
		button: form.querySelector('[data-add-to-cart]'),
		buttonText: form.querySelector('[data-button-text]'),
	};

	const formatPrice = (value) => {
		const hasKopecks = !Number.isInteger(value);
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'RUB',
			minimumFractionDigits: hasKopecks ? 2 : 0,
			maximumFractionDigits: 2,
		}).format(value);
	};

	const render = (input) => {
		const price = Number(input.dataset.price);
		const oldPrice = Number(input.dataset.oldPrice) || 0;
		const hasDiscount = oldPrice > price;

		els.sku.textContent = input.dataset.sku;
		els.price.textContent = formatPrice(price);
		els.priceMeta.setAttribute('content', price.toFixed(2));

		els.oldPrice.textContent = hasDiscount ? formatPrice(oldPrice) : '';
		els.oldPrice.hidden = !hasDiscount;

		if (els.badge) {
			const percent = hasDiscount ? Math.round((1 - price / oldPrice) * 100) : 0;
			els.badge.hidden = !hasDiscount;
			els.badge.textContent = `−${percent}%`;
			els.badge.setAttribute('aria-label', `Скидка ${percent}%`);
		}
	};

	form.addEventListener('change', (event) => {
		if (event.target.matches('.pack__input')) render(event.target);
	});

	let resetTimer;
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		clearTimeout(resetTimer);

		els.button.classList.add('is-added');
		els.buttonText.textContent = 'Добавлено';

		resetTimer = setTimeout(() => {
			els.button.classList.remove('is-added');
			els.buttonText.textContent = 'В корзину';
		}, 2000);
	});

	const checked = form.querySelector('.pack__input:checked') || els.inputs[0];
	if (checked) render(checked);
})();
