import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

export default class MultiSelectSortableFlatlist extends React.Component {
  static defaultProps = {
    onItemSelected: () => {},
    onItemDeselected: () => {},
    onItemTap: () => {},
    onSort: () => {},
    scrollPercent: 5,
    sortable: true,
    selectable: true,
    mode: 'auto',
    initialSelectedItems: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [...this.props.initialSelectedItems],
    };
    this.CURRENTMOVE = null;
  }

  shouldComponentUpdate() {
    if (this.CURRENTMOVE != null) {
      this.CURRENTMOVE();
      this.CURRENTMOVE = null;
    }
    return true;
  }

  AddSelectedIndex(item, index, move = null) {
    const selected = this.IsItemSelected(item);
    this.MoveItem(move, selected);
    if (!selected && this.props.selectable) {
      const selectedItems = this.state.selectedItems;
      selectedItems.push(item);
      this.setState({ selectedItems: selectedItems });
      this.props.onItemSelected({ selectedItems, item, index });
    }
  }

  MoveItem(move, selected) {
    if (this.props.sortable && move && this.props.data.length >= 2) {
      selected ? move() : (this.CURRENTMOVE = move);
    }
  }

  OnTap(item, index) {
    if (this.state.selectedItems.length <= 0) {
      this.props.onItemTap({ item, index });
    } else {
      this.ReverseSelection(item, index);
    }
  }

  DeselectAll() {
    this.setState({ selectedItems: [] });
    return [];
  }

  SelectAll() {
    this.setState({ selectedItems: [...this.props.data] });
    return [...this.props.data];
  }

  SelectionOverwrite(SelectedItems) {
    this.setState({ selectedItems: [...SelectedItems] });
  }

  GetIndexofItem(item) {
    if (this.props.comparingFactor) {
      return this.state.selectedItems.findIndex(comp => {
        return comp[this.props.comparingFactor] == item[this.props.comparingFactor];
      });
    } else {
      return this.state.selectedItems.indexOf(item);
    }
  }

  IsItemSelected(item) {
    if (this.props.comparingFactor) {
      return this.state.selectedItems.some(comp => {
        return comp[this.props.comparingFactor] == item[this.props.comparingFactor];
      });
    } else {
      return this.state.selectedItems.includes(item);
    }
  }

  OnSort(newDataOrder) {
    this.props.onSort(newDataOrder);
  }

  ReverseSelection(item, index) {
    const indexOfIndex = this.GetIndexofItem(item);
    const selectedItems = this.state.selectedItems;
    if (indexOfIndex > -1) {
      selectedItems.splice(indexOfIndex, 1);
      this.setState({ selectedItems: selectedItems });
      this.props.onItemDeselected({ selectedItems, item, index });
    } else {
      this.AddSelectedIndex(item, index);
    }
  }

  renderItem(item, index, move, moveEnd) {
    var Component;
    const Mode = this.props.mode;
    if (Mode == 'auto') {
      Component = (
        <TouchableWithoutFeedback
          onPress={() => this.OnTap(item, index)}
          onPressOut={() => moveEnd()}
          onLongPress={() => {
            this.AddSelectedIndex(item, index, move);
          }}>
          <View>
            {this.props.renderItem({
              item,
              index,
              selected: this.IsItemSelected(item),
            })}
          </View>
        </TouchableWithoutFeedback>
      );
    } else if (Mode == 'manual') {
      Component = this.props.renderItem({
        item,
        index,
        selected: this.IsItemSelected(item),
        drag: move,
        dragEnd: moveEnd,
        reverseSelection: () => this.ReverseSelection(item, index),
      });
    }
    return Component;
  }

  render() {
    return (
      <DraggableFlatList
        {...this.props}
        scrollPercent={this.props.scrollPercent}
        onMoveEnd={({ data }) => this.OnSort(data)}
        extraData={[this.state.selectedItems, { ...this.props.extraData }]}
        renderItem={({ item, index, move, moveEnd }) => this.renderItem(item, index, move, moveEnd)}
      />
    );
  }
}
