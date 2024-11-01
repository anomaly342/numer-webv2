const methods = [
	{
		title: "Root",
		sublinks: [
			{ name: "Bisection", url: "/bisection", api: "/root/bisection" },
			{
				name: "False-position",
				url: "/false_position",
				api: "/root/false_position",
			},
			{
				name: "Fixed-point",
				url: "/fixed_point",
				api: "/root/fixed_point",
			},
			{
				name: "Newton-raphson",
				url: "/newton_raphson",
				api: "/root/newton_raphson",
			},
			{ name: "Secant", url: "/secant", api: "/root/secant" },
		],
	},
	{
		title: "Linear equation",
		sublinks: [
			{ name: "Cramer's Rule", url: "/cramer", api: "/linear/cramer" },
			{
				name: "Gauss Elimination",
				url: "/gauss_elimination",
				api: "/linear/gauss_elimination",
			},
			{
				name: "Gauss-Jordan Elimination",
				url: "/gauss_jordan_elimination",
				api: "/linear/gauss_jordan_elimination",
			},
			{
				name: "Matrix Inversion",
				url: "/matrix_inversion",
				api: "/linear/matrix_inversion",
			},
			{
				name: "Lu Decomposition",
				url: "/lu_decomposition",
				api: "/linear/lu_decomposition",
			},
			{
				name: "Cholesky Decomposition",
				url: "/cholesky_decomposition",
				api: "/linear/cholesky_decomposition",
			},
			{
				name: "Jacobi Iteration",
				url: "/jacobi_iteration",
				api: "/linear/jacobi_iteration",
			},
		],
	},
];

export default methods;
