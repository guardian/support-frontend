import { promotionHTML } from './promotionHtml';

describe('promotionHTML', () => {
	it('should return promotion html if present', () => {
		expect(promotionHTML()).toEqual(null);

		expect(promotionHTML('Get 25% off')?.props).toEqual({
			__EMOTION_TYPE_PLEASE_DO_NOT_USE__: 'span',
			css: '',
			dangerouslySetInnerHTML: {
				__html: 'Get 25% off',
			},
		});

		expect(
			promotionHTML('Get 20% off', {
				tag: 'div',
			})?.props,
		).toEqual({
			__EMOTION_TYPE_PLEASE_DO_NOT_USE__: 'div',
			css: '',
			dangerouslySetInnerHTML: {
				__html: 'Get 20% off',
			},
		});
	});
});
