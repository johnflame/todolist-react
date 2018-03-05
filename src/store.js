    const STORAGE_List = 'todos-reactjs';
	// const STORAGE_KEY = 'todos-react-key';
	export default  {
		fetchList() {
			return JSON.parse(localStorage.getItem(STORAGE_List) || '[]');
		},

		save(todos) {
			localStorage.setItem(STORAGE_List, JSON.stringify(todos));
		}
	};