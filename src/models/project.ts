// Project Class
export enum ProjectStatus {
	ACTIVE,
	FINISHED,
}

export default class Project {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public people: number,
		public status: ProjectStatus
	) {}
}
