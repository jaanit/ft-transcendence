export class Queue<T, D> {
	private id: T[];
	private data: D[];

	constructor() {
		this.id = [];
		this.data = []
	}

	enqueue(item: T, data: D) {
		this.id.push(item);
		this.data.push(data);
	}

	dequeue(): {item: T , data: D} | undefined {
		return {item: this.id.shift() , data: this.data.shift()};
	}

	isEmpty(): boolean {
		return this.id.length === 0;
	}

	size(): number {
		return this.id.length;
	}

	contains(item: T): boolean {
		return this.id.includes(item);
	}

	containsData(data: D)
	{
		const idx = this.data.findIndex(d => this.objEqual(d, data));
		return idx;
	}

	objEqual(obj1: any, obj2: any): boolean{
		return JSON.stringify(obj1) === JSON.stringify(obj2);
	}

	getIdxData(data: D): number | undefined{
		const index = this.data.indexOf(data);
		if (index < 0){
			return undefined;
		}
		return index;
	}

	getNoData(): {item: T, data: D} | undefined{
		const index = this.data.indexOf(null);
		if (index < 0){
			return undefined;
		}
		const ret = {item: this.id[index], data: this.data[index]};
		this.erase(ret.item);
		return ret;
	}

	erase(item: T): void {
		const index = this.id.indexOf(item);
		if (index > -1) {
			this.id.splice(index, 1);
			this.data.splice(index, 1);
			this.erase(item)
		}
	}
	
	getDataByIdx(idx: number):{item: T, data: D} | undefined{
		if (idx < 0)
			return undefined;
		const ret = {item: this.id[idx], data: this.data[idx]};
		this.erase(ret.item);
		return ret;
	}

	
}