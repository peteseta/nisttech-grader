// export function load({ cookies }) {
// 	const id = cookies.get('userid');

// 	if (!id) {
// 		cookies.set('userid', crypto.randomUUID(), { path: '/' });
// 	}

// 	return {
// 		todos: db.getTodos(id) ?? []
// 	};
// }

/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		// TODO log the user in
	}
};