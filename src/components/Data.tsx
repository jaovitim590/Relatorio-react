import GlareHover from './GlareHover'
import { Link } from 'react-router-dom'

type DataProps = {
  dia: string
  id: number
}

export const Data = ({ dia, id }: DataProps) => {
  return (
    <Link to={`/relatorio/${id}`}>
    <div className="flex justify-center items-center">
      <GlareHover
        glareColor="#ffffff"
        glareOpacity={0.3}
        glareAngle={-30}
        glareSize={300}
        transitionDuration={800}
        playOnce={false}
        className='hover:scale-115 duration-100'
        style={{
    '--gh-width': '16rem',
    '--gh-height': '6rem',
    '--gh-br': '1rem',
  } as React.CSSProperties}
      >
        <h2 className="text-2xl font-medium">{dia}</h2>
      </GlareHover>
    </div>
    </Link>
  )
}
