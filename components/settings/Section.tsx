import React from 'react';
import { motion } from 'framer-motion';

export default class Section extends React.Component<{
    id: string,
    title: string,
    action?: React.ReactNode,
    position: number,
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
}> {
    render() {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.2,
                    delay: this.props.position * 0.1,
                    ease: "easeInOut"
                }}>
                <div className="section scrollspy" id={this.props.id}>
                    <div className="card hoverable">
                        <form onSubmit={this.props.onSubmit}>
                            <div className="card-content">

                                <div className="card-title" style={{
                                    marginBottom: 20
                                }}>
                                    {this.props.title}
                                </div>
                                {this.props.children}
                            </div>
                            {this.props.action ?
                                <div className="card-action">
                                    {this.props.action}
                                </div> : ""}
                        </form>
                    </div>
                </div>
            </motion.div>
        );
    }
}