// The whole point of this proof is the stylesheet import below: it makes Vite
// resolve `@use 'sass-mq'` through the package's `package.json`. If sass-mq is
// missing an `exports` field, Vite 8 fails to resolve it and the build errors.
import './styles.scss';
