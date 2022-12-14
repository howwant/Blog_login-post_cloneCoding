import styled from "styled-components";

const ResponsiveBlock = styled.div`
    padding-left: 1rem;
    padding-right: 1rem;
    width: 1024px;
    margin: 0 auto;

    @media (max-width: 1024px) {
        width: 768px;
    }
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const Responsive = ({ children, ...rest}) =>{
    //style, classname, onClick, onMouseMove 등을 props를 사용
    return(
        <ResponsiveBlock {...rest}>
            {children}
        </ResponsiveBlock>
    );
};

export default Responsive;