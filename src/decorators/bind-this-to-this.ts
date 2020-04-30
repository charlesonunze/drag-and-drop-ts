namespace App {
	// AutoBind Decorator
	export function BindThisToThis(
		_: any,
		__: string,
		descriptor: PropertyDescriptor
	) {
		const originalMethod = descriptor.value;
		const newDescriptor: PropertyDescriptor = {
			configurable: true,
			get() {
				const boundFN = originalMethod.bind(this);
				return boundFN;
			},
		};
		return newDescriptor;
	}
}
