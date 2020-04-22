// AutoBind Decorator
function BindThisToThis(_: any, __: string, descriptor: PropertyDescriptor) {
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

	private getUserInput(): [string, string, number] | void {
		const _title = this._title.value;
		const _description = this._description.value;
		const _people = parseInt(this._people.value);

		if (!_title || !_description || !_people) {
			console.log('Please enter valid information');
			return;
		}

		return [_title, _description, _people];
	}

	private clearUserInput() {
		this._title.value = '';
		this._people.value = '';
		this._description.value = '';
	}

	@BindThisToThis
	private submitHandler(event: Event) {
		event.preventDefault();
		const data = this.getUserInput();

		if (Array.isArray(data)) {
			const [_title, _description, _people] = data;
			console.log(_title, _description, _people);
			this.clearUserInput();
		}
	}

	private addListener() {
		this._form.addEventListener('submit', this.submitHandler);
	}

	private attachNode() {
		this._app.insertAdjacentElement('afterbegin', this._form);
	}
}

const projectInput = new ProjectInput();
