import DemoTodayClient from './DemoTodayClient'
import { DEMO_TARGETS } from '@/lib/demo/data'

export default function DemoTodayPage() {
  return <DemoTodayClient targets={DEMO_TARGETS} />
}
