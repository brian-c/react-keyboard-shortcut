This doesn't render anything, but it modifies the `title` (or `data-shortcut`, if `secret` is set) attribute of its child to be picked up by the `title-shortcut-handler` lib.

```jsx
import Shortcut from 'react-keyboard-shortcut';

<Shortcut char="+">
  <button type="button" title="Add one">Increment</button>
</Shortcut>

<Shortcut ctrl char="W" secret>
  <button type="button">Close window</button>
</Shortcut>
```
