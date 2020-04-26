// Drag and Drop Interfaces
interface Draggable {
	dragStartHandler(event: DragEvent): void;
	dragEndHandler(event: DragEvent): void;
}

interface DropTarget {
	dragOverHandler(event: DragEvent): void;
	dropHandler(event: DragEvent): void;
	dragLeaveHandler(event: DragEvent): void;
}

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

// Project Class
enum ProjectStatus {
	ACTIVE,
	FINISHED,
}

class Project {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public people: number,
		public status: ProjectStatus
	) {}
}

// Project State
type Listener<T> = (items: T[]) => void;

class State<T> {
	protected listeners: Listener<T>[] = [];

	addListener(listener: Listener<T>) {
		this.listeners.push(listener);
	}
}

class ProjectState extends State<Project> {
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {
		super();
	}

	addProject(title: string, description: string, numOfPeople: number) {
		const newProject = new Project(
			Math.random().toString(),
			title,
			description,
			numOfPeople,
			ProjectStatus.ACTIVE
		);

		this.projects.push(newProject);
		this.updateListeners();
	}

	moveProject(projectId: string, newStatus: ProjectStatus) {
		const project = this.projects.find((p) => p.id === projectId);
		if (project && project.status !== newStatus) {
			project.status = newStatus;
			this.updateListeners();
		}
	}

	private updateListeners() {
		this.listeners.forEach((listenerFn) => {
			listenerFn([...this.projects]);
		});
	}

	static getInstance() {
		if (this.instance) return this.instance;
		this.instance = new ProjectState();
		return this.instance;
	}
}

const state = ProjectState.getInstance();

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
		this.template = document.getElementById(templateId) as HTMLTemplateElement;

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

// ProjectList Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
	implements Draggable {
	private project: Project;

	public get persons(): string {
		if (this.project.people === 1) return '1 person';
		return `${this.project.people} persons`;
	}

	constructor(parentId: string, project: Project) {
		super('single-project', parentId, true, project.id);
		this.project = project;
		this.configure();
		this.renderContent();
	}

	@BindThisToThis
	dragStartHandler(event: DragEvent) {
		event.dataTransfer!.setData('text/plain', this.project.id);
		event.dataTransfer!.effectAllowed = 'move';
	}

	dragEndHandler(_: DragEvent) {
		console.log('dragend');
	}

	configure() {
		this.childElement.addEventListener('dragstart', this.dragStartHandler);
		this.childElement.addEventListener('dragend', this.dragEndHandler);
	}

	renderContent() {
		this.childElement.querySelector('h2')!.textContent = this.project.title;
		this.childElement.querySelector(
			'h3'
		)!.textContent = this.project.description;
		this.childElement.querySelector(
			'p'
		)!.textContent = `${this.persons} assigned.`;
	}
}

class ProjectList extends Component<HTMLDivElement, HTMLElement>
	implements DropTarget {
	_projects: Project[];

	constructor(private type: 'active' | 'finished') {
		super('project-list', 'app', true, `${type}-projects`);
		this._projects = [];

		this.configure();
		this.renderContent();
	}

	@BindThisToThis
	dragOverHandler(event: DragEvent) {
		if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
			event.preventDefault();
			const listEl = this.childElement.querySelector('ul')!;
			listEl.classList.add('droppable');
		}
	}

	@BindThisToThis
	dropHandler(event: DragEvent) {
		const projectId = event.dataTransfer!.getData('text/plain');
		state.moveProject(
			projectId,
			this.type === 'active' ? ProjectStatus.ACTIVE : ProjectStatus.FINISHED
		);
	}

	@BindThisToThis
	dragLeaveHandler(_: DragEvent) {
		const listEl = this.childElement.querySelector('ul')!;
		listEl.classList.remove('droppable');
	}

	configure() {
		this.childElement.addEventListener('dragover', this.dragOverHandler);
		this.childElement.addEventListener('drop', this.dropHandler);
		this.childElement.addEventListener('dragleave', this.dragLeaveHandler);

		state.addListener((projects: Project[]) => {
			const projectsToRender = projects.filter((p) => {
				if (this.type === 'active') return p.status === ProjectStatus.ACTIVE;
				return p.status === ProjectStatus.FINISHED;
			});
			this._projects = projectsToRender;
			this.renderProjects();
		});
	}

	renderContent() {
		const listId = `${this.type}-project-list`;
		this.childElement.querySelector('ul')!.id = listId;
		this.childElement.querySelector('h2')!.innerText =
			this.type.toLocaleUpperCase() + ' PROJECTS';
	}

	private renderProjects() {
		const listTag = document.getElementById(
			`${this.type}-project-list`
		)! as HTMLUListElement;

		listTag.innerHTML = '';

		this._projects.forEach((p) => {
			new ProjectItem(this.childElement.querySelector('ul')!.id, p);
		});
	}
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
	_description: HTMLInputElement;
	_people: HTMLInputElement;
	_title: HTMLInputElement;

	constructor() {
		super('project-input', 'app', false, 'user-input');
		this.parentElement = document.getElementById('app') as HTMLDivElement;
		this.template = document.getElementById(
			'project-input'
		) as HTMLTemplateElement;

		this._title = this.childElement.querySelector('#title') as HTMLInputElement;
		this._people = this.childElement.querySelector(
			'#people'
		) as HTMLInputElement;
		this._description = this.childElement.querySelector(
			'#description'
		) as HTMLInputElement;

		this.configure();
	}

	configure() {
		this.childElement.addEventListener('submit', this.submitHandler);
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
}

const projectInput = new ProjectInput();
const activeProjects = new ProjectList('active');
const finishedProjects = new ProjectList('finished');
