import Styles from './Container.css';

function Container(props){
    return(
         <div className={`${Styles.container} ${Styles[props.customClass]}`}>
            {props.children}
         </div>
    )
}

export default Container