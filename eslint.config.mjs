import next from "@next/eslint-plugin-next"
import react from "eslint-plugin-react"
import hooks from "eslint-plugin-react-hooks"

export default [
    {
        plugins: {
            "@next/next": next,
            react: react,
            "react-hooks": hooks,
        },
        rules: {
            ...next.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...hooks.configs.recommended.rules,
            "react/react-in-jsx-scope": "off",
        },
    },
]