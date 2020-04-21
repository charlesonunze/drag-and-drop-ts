class ProjectInput {
	_template: HTMLTemplateElement;
	_form: HTMLFormElement;
	_app: HTMLDivElement;

	_description: HTMLInputElement;
	_people: HTMLInputElement;
	_title: HTMLInputElement;

	constructor() {
		this._app = document.getElementById('app') as HTMLDivElement;
		this._template = document.getElementById(
			'project-input'
		) as HTMLTemplateElement;

		const importedNode = document.importNode(this._template.content, true);
		this._form = importedNode.firstElementChild as HTMLFormElement;
		this._form.id = 'user-input';

		this._title = this._form.querySelector('#title') as HTMLInputElement;
		this._people = this._form.querySelector('#people') as HTMLInputElement;
		this._description = this._form.querySelector(
			'#description'
		) as HTMLInputElement;

		this.addListener();
		this.attachNode();
	}

	private submitHandler(event: Event) {
		event.preventDefault();
	}

	private addListener() {
		this._form.addEventListener('submit', this.submitHandler.bind(this));
	}

	private attachNode() {
		this._app.insertAdjacentElement('afterbegin', this._form);
	}
}

const projectInput = new ProjectInput();
