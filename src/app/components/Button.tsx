import styled from "styled-components";

export const ButtonStyled = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  min-height: 44px;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;

  background: var(--colors-bayoux);
  color: var(--colors-blank);
`;

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <ButtonStyled {...props} />;
}
