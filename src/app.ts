class ProjectInput {
	template: HTMLTemplateElement;
	form: HTMLFormElement;
	app: HTMLDivElement;

	constructor() {
		this.app = document.getElementById('app') as HTMLDivElement;
		this.template = document.getElementById(
			'project-input'
		) as HTMLTemplateElement;

		const importedNode = document.importNode(this.template.content, true);
		this.form = importedNode.firstElementChild as HTMLFormElement;

		this.attachNode();
	}

	private attachNode() {
		this.app.insertAdjacentElement('afterbegin', this.form);
	}
}

const projectInput = new ProjectInput();
