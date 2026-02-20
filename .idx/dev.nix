{ pkgs, ... }: {
	# Which nixpkgs channel to use.
	channel = "stable-23.11"; # or "unstable"
	# Use https://search.nixos.org/packages to find packages
	packages = [
		pkgs.nodejs_20
        pkgs.gh
	];
	# Sets environment variables in the workspace
	env = {};
	idx.workspace.onStart = {
		# The welcome message when the workspace starts
		welcome = "hello";
		# Commands to run in sequence when the workspace starts
		init = "echo 'init'";
		# Commands to run in parallel when the workspace starts
		parallel = "npm install --no-frozen-lockfile && npm run dev";
	};
	# Enable previews and customize configuration
	idx.previews = {
		enable = true;
		previews = [
			{
				# The name that shows up in the UI
				id = "web";
				# Command to start the preview
				command = "npm run dev -- --port $PORT --host 0.0.0.0";
				# The port that the command runs on
				port = 5173;
				# What to do when the port is found
				# Options are: "open" | "ignore" | "ask"
				onPortFound = "open";
			}
		];
	};
	# Workspace extensions
	idx.extensions = [
		"unifiedjs.vscode-mdx"
		"esbenp.prettier-vscode"
	];
}
