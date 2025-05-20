module.exports = {
  presets: ['module:@react-native/babel-preset'],
  "plugins": [
    'react-native-reanimated/plugin',
    ['module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        blacklist: null, // DEPRECATED
        whitelist: null, // DEPRECATED
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
    ["module-resolver", {
      "root": ['./src'],
      "extensions": [".tsx", ".ts", ".js", ".jsx", ".json", ".jsonc"],
      "alias": { "*": "./src/", }
    }
    ]
  ]
};
