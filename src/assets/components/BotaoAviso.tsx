import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';

export function BotaoAviso() {
  const [showModal, setShowModal] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  const handleClick = () => {
    setShowModal(true);
    setHasNotification(false);
  };

  return (
    <>
      <style>{`
        @keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  10% { transform: rotate(-8deg); }
  20% { transform: rotate(8deg); }
  30% { transform: rotate(-8deg); }
  40% { transform: rotate(8deg); }
  50% { transform: rotate(0deg); }
}
        
        .shake-animation {
          animation: shake 0.5s ease-in-out infinite;
        }
        
        .shake-animation:hover {
          animation: none;
        }
      `}</style>

      <button
        onClick={handleClick}
        className="shake-animation fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Avisos"
      >
        <Bell size={40} />
        {hasNotification && (
          <span className="absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-full animate-pulse"></span>
        )}
      </button>

      {/* Modal de Aviso */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-start gap-3">
              <div className="bg-yellow-500 p-2 rounded-full">
                <Bell size={20} className="text-gray-900" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-red-700">AVISO SUPER ULTRA MEGA IMPORTANTE!!!</h3>
                <p className="text-gray-300 mb-4">
                  deu mt merda no banco de dados nessas ferias, e eu n consegui arrumar completamente, voce nao perdeu nada obviamente, mas como voce vai acabar vendo
                  os relatorios estao com "?" aonde era para ter acentos, perdao por ter cometido um erro <span className='text-red-700'>IMBECIL</span>, porem acredito eu que os erros foram corrigidos.
                </p>

                <p className="text-gray-300 mb-4">
                  Se por algum acaso algum erro ocorrer e eu nao ser notificado automaticamente <span className="font-bold">NAO HESITE</span> em me mandar mensagem, sei q nao quer falar comigo <span className='font-bold'>MAS </span> 
                   esse site foi feito para voce, e ele DEVE funcionar corretamente, so precisa me mandar: <span className='text-green-400'>"oi, o site quebrou."</span>, 
                  nao vai ser grosseiro nem nada, eu irei entender perfeitamente e corrigir o mais rapido possivel.
                </p>

                <p className='text-sm font-bold pu-4'>Agradeço a compreensao (se tiver tido KKKKK), e agradeço ainda mais se me enviar uma mensagem caso tenha um erro!</p>

                <p className='font-extralight text-sm py-5'>Esse botao vai ficar por muito tempo, ate ter certeza que voce viu. (me AVISA se quiser que eu tire!!!!!)</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Entendi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}