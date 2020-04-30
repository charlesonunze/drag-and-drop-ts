import Project, { ProjectStatus } from '../models/project';

// Project State
type Listener<T> = (items: T[]) => void;

class State<T> {
	protected listeners: Listener<T>[] = [];

	addListener(listener: Listener<T>) {
		this.listeners.push(listener);
	}
}

export class ProjectState extends State<Project> {
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

export default state;
