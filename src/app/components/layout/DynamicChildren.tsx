import { motion } from 'framer-motion'
interface DynamicChildrenProps {
    readonly children: React.ReactNode;
  }
  

export default function DynamicChildren({ children }: DynamicChildrenProps) {
    return (
        <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: 'easeInOut', duration: 0.25 }}
        >
            {children}
        </motion.div >
     );
}

