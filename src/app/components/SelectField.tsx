import styled from "styled-components";

export const SelectContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Select = styled.select`
  border: 1px solid var(--colors-lynch);
  border-radius: 4px;
  padding: 6px 10px 6px 10px;

  background: var(--colors-blank);
  outline-color: var(--colors-darkGray);
  outline-offset: 4px;
  outline-width: 2px;
  cursor: pointer;
  width: 150px;

  ${({ theme }) => theme.typography.bodySmallBold};
  color: var(--colors-bayoux);

  &:hover,
  &:focus,
  &:not(:placeholder-shown) {
    background-color: var(--colors-catskillWhite);
  }

  &:not(:placeholder-shown) {
    outline: none;
    color: var(--colors-darkBlue);
  }
`;

export const LabelStyled = styled.label`
  clip: rect(0px, 0px, 0px, 0px);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  top: 0px;
  left: 0px;
  white-space: nowrap;
  width: 1px;
`;

export function SelectField(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <SelectContainer>
      <LabelStyled htmlFor="search-field">Search</LabelStyled>
      <SelectField {...props}>{props.children}</SelectField>
    </SelectContainer>
  );
}
