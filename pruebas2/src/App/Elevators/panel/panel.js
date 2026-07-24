function PanelInfo({ className, title, value }) {

    return (
        <div className={className}>

            <span>{title}</span>

            <span>{value}</span>

        </div>
    );

}

export default PanelInfo;