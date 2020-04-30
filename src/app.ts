/// <reference path="models/drag-and-drop.ts" />
/// <reference path="models/project.ts" />
/// <reference path="state/index.ts" />
/// <reference path="decorators/bind-this-to-this.ts" />
/// <reference path="components/project-input.ts" />
/// <reference path="components/project-list.ts" />

namespace App {
	new ProjectInput();
	new ProjectList('active');
	new ProjectList('finished');
}
