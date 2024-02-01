
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

interface DashboardCardProps {
  //category: string;
  badge: string;
  color: string;
  backgroundColor: string;
  title: string;
  icon?: string; // Opcional, pode não ser passado
  ctaText: string;
  className?: string;
  onCtaClick: () => void; // Tipo para uma função sem retorno
}

//



const Card = styled.div<{ backgroundColor: string, color: string }>`
  position: relative; // Importante para o posicionamento absoluto dos filhos
  background-color: ${(props) => props.backgroundColor || '#fff'};
  color: ${(props) => props.color || '#fffff'}; // Adicionando cor do texto
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  text-align: left;
  flex-direction: column;
  align-items: center;
  font-size: 23px;
  min-width: 200px;
  width: 250px;
  height: 180px;

`;

const Title = styled.h3`
  max-width: 200px;
  margin: 15px 0;
  align-self: flex-start;
  justify-self: flex-start;

  line-height: 1.2;
  font-size: 7vw; // ajusta com base na largura da viewport
`;


const Icon = styled.img`
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: 10px; // Posição do ícone no canto inferior direito
  right: 20px;
  bottom: 20px;
`;

const CtaButton = styled.button`
font-size: 15px;
font-weight: bold;
  margin-top: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #333;
  color: white;
  cursor: pointer;
  position: absolute;
  bottom: 10px; // Posição do CTA no canto inferior esquerdo
  left: 10px;
`;

const Badge = styled.span`
 // border: 2px solid;
  padding: 5px;
  border-radius: 20px;
  position: absolute;
  top: 10px; // Posição do badge no canto superior direito
  right: 10px;
  
`;


const DashboardCardMobile: React.FC<DashboardCardProps> = ({ color, backgroundColor, title, icon, ctaText, onCtaClick, badge }) => {

    const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const adjustFontSize = () => {
      const element = titleRef.current;
      if (!element) return;

      let fontSize = parseFloat(window.getComputedStyle(element, null).getPropertyValue('font-size'));
      while (element.scrollHeight > element.offsetHeight) {
        fontSize -= 1;
        element.style.fontSize = `${fontSize}px`;
      }
    };

    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);

    return () => {
      window.removeEventListener('resize', adjustFontSize);
    };
  }, [title]);

  return (
    <Card color={color} backgroundColor={backgroundColor} onClick={onCtaClick}>
      <Title ref={titleRef}>{title}</Title>
      {icon && <Icon src={icon} alt="Icon" />}
      <CtaButton style={{backgroundColor: backgroundColor, color: color, border: color}} onClick={onCtaClick}>{ctaText}</CtaButton>
      {badge && <Badge>{badge}</Badge>}
    </Card>
  );
};

export default DashboardCardMobile;
