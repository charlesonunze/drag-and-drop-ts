import Component from './base-component';
import { Draggable } from '../models/drag-and-drop';
import Project from '../models/project';
import BindThisToThis from '../decorators/bind-this-to-this';

// ProjectList Class
export default class ProjectItem
	extends Component<HTMLUListElement, HTMLLIElement>
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
