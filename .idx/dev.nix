{ pkgs, ... }: {
  # 👇 FIX 1: Channel ko "unstable" kar diya taaki latest Node.js mil sake 👇
  channel = "unstable"; 

  # Use https://search.nixos.org/packages to find packages
  packages = [
    # 👇 FIX 2: Ab hum safely nodejs_22 use kar sakte hain 👇
    pkgs.nodejs_22  
    pkgs.gh
  ];

  # Sets environment variables in the workspace
  env = {};

  idx = {
    # Workspace extensions
    extensions = [
      "unifiedjs.vscode-mdx"
      "esbenp.prettier-vscode"
    ];

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        npm-install = "npm install --no-frozen-lockfile";
      };
      # Runs every time the workspace starts
      onStart = {
        welcome = "echo 'hello'";
        init = "echo 'init'";
      };
    };

    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          # Command to start the preview (Must be an array of strings in Nix)
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}