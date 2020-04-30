/// <reference path="base-component.ts" />
namespace App {
	export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
		_description: HTMLInputElement;
		_people: HTMLInputElement;
		_title: HTMLInputElement;

		constructor() {
			super('project-input', 'app', false, 'user-input');
			this.parentElement = document.getElementById('app') as HTMLDivElement;
			this.template = document.getElementById(
				'project-input'
			) as HTMLTemplateElement;

			this._title = this.childElement.querySelector(
				'#title'
			) as HTMLInputElement;
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
}
