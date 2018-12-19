import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
  listContainer: {
    height: "360px",
    maxHeight: "360px",
    overflowY: "scroll"
  },
  buttonActive: {
    borderRadius: "5px",
    backgroundColor: "#2289F0",
    color: "white",
    fontSize: "large"
  },
  buttonInactive: {
    backgroundColor: "white",
    color: "#2289F0",
    fontSize: "large"
  }
});

class ListDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCountry: 0
    };
  }

  handleSelect = key => {
    this.setState({ selectedCountry: key });
    this.props.handleSelect(key);
  };

  getButtonClass = index => {
    return this.props.selectedElement === index
      ? "buttonActive"
      : "buttonInactive";
  };

  displayList = () => {
    const { classes } = this.props;
    return (
      <List className={classes.listContainer}>
        {this.props.displayedList.map((item, index) => {
          return (
            <ListItem
              button
              key={index}
              className={classes[this.getButtonClass(index)]}
              size="lg"
              onClick={() => this.handleSelect(index)}
            >
              {item}
              <Divider />
            </ListItem>
          );
        })}
      </List>
    );
  };

  render() {
    return <div>{this.displayList()}</div>;
  }
}

ListDisplay.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ListDisplay);
