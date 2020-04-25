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

// Project State
class ProjectState {
	private projects: any[] = [];
	private listeners: any[] = [];
	private static instance: ProjectState;

	private constructor() {}

	addProject(title: string, description: string, numOfPeople: number) {
		const newProject = {
			title,
			description,
			numOfPeople,
			id: Math.random.toString(),
		};
		this.projects.push(newProject);
		this.listeners.forEach((listenerFn) => {
			listenerFn([...this.projects]);
		});
	}

	addListener(listener: Function) {
		this.listeners.push(listener);
	}

	static getInstance() {
		if (this.instance) return this.instance;
		this.instance = new ProjectState();
		return this.instance;
	}
}

const state = ProjectState.getInstance();

// ProjectList Class
class ProjectList {
	_template: HTMLTemplateElement;
	_section: HTMLElement;
	_app: HTMLDivElement;
	_projects: any[];

	constructor(private type: 'active' | 'finished') {
		this._app = document.getElementById('app') as HTMLDivElement;
		this._template = document.getElementById(
			'project-list'
		) as HTMLTemplateElement;
		this._projects = [];

		const importedNode = document.importNode(this._template.content, true);
		this._section = importedNode.firstElementChild as HTMLElement;
		this._section.id = `${this.type}-projects`;

		state.addListener((projects: any[]) => {
			this._projects = projects;
			this.renderProjects();
		});

		this.attachNode();
		this.renderContent();
	}

	private renderProjects() {
		const listTag = document.getElementById(
			`${this.type}-projects`
		)! as HTMLUListElement;

		this._projects.forEach((p) => {
			const listItem = document.createElement('li');
			listItem.textContent = p.title;
			listTag.appendChild(listItem);
		});
	}

	private attachNode() {
		this._app.insertAdjacentElement('beforeend', this._section);
	}

	private renderContent() {
		const listId = `${this.type}-project-list`;
		this._section.querySelector('ul')!.id = listId;
		this._section.querySelector('h2')!.innerText =
			this.type.toLocaleUpperCase() + ' PROJECTS';
	}
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
			state.addProject(_title, _description, _people);
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
const activeProjects = new ProjectList('active');
const finishedProjects = new ProjectList('finished');
