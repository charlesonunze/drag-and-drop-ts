import Component from './base-component';
import { DropTarget } from '../models/drag-and-drop';
import state from '../state/index';
import Project, { ProjectStatus } from '../models/project';
import ProjectItem from 'project-item';
import BindThisToThis from '../decorators/bind-this-to-this';

export default class ProjectList extends Component<HTMLDivElement, HTMLElement>
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
