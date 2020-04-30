namespace App {
	export abstract class Component<
		T extends HTMLElement,
		U extends HTMLElement
	> {
		template: HTMLTemplateElement;
		parentElement: T;
		childElement: U;

		constructor(
			templateId: string,
			parentElementId: string,
			renderBefore: boolean,
			newElementId?: string
		) {
			this.parentElement = document.getElementById(parentElementId) as T;
			this.template = document.getElementById(
				templateId
			) as HTMLTemplateElement;

			const importedNode = document.importNode(this.template.content, true);
			this.childElement = importedNode.firstElementChild as U;
			if (newElementId) this.childElement.id = newElementId;

			this.attachNode(renderBefore);
		}

		private attachNode(renderBefore: boolean) {
			this.parentElement.insertAdjacentElement(
				renderBefore ? 'beforeend' : 'afterbegin',
				this.childElement
			);
		}
	}
}
