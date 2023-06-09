// import './index.css'

import BubWrapper from './src/components/bubWrapper'
import Button from './src/components/button'
import Group from './src/components/Group'
import Input from './src/components/input'
import Title from './src/components/Title'
import { myUseQuery as createUseCrud } from './src/hooks/myUseQuery'
import useBub from './src/main'

export default useBub

export { Title, Group, Button, Input, BubWrapper, createUseCrud }
