import axios from 'axios'

/*
 * ACTION TYPES
 */
const GET_ORDERITEM = 'GET_ORDERITEM'
const UPDATE_ORDERITEM = 'UPDATE_ORDERITEM'
const INCREASE_QUANTITY = 'INCREASE_QUANTITY'
const DECREASE_QUANTITY = 'DECREASE_QUANTITY'

/**
 * INITIAL STATE
 */
const defaultOrderItem = []

/**
 * ACTION CREATORS
 */

const getOrderItemAction = orderItems => ({type: GET_ORDERITEM, orderItems})
const updateOrderItemsAction = orderItems => ({
  type: UPDATE_ORDERITEM,
  orderItems
})
export const increaseQuantityAction = orderItems => ({
  type: INCREASE_QUANTITY,
  orderItems
})

export const decreaseQuantityAction = orderItems => ({
  type: DECREASE_QUANTITY,
  orderItems
})

/**
 * THUNK CREATORS
 */

export const getOrderItem = orderId => async dispatch => {
  try {
    const response = await axios.get(`/api/orders/orderItems/${orderId}`)
    dispatch(getOrderItemAction(response.data))
  } catch (err) {
    console.error(err)
  }
}

export const updateOrderItems = orderItem => async dispatch => {
  try {
    const response = await axios.put(
      `/api/orders/updateOrderItems/${orderItem.orderId}/${
        orderItem.productId
      }/${orderItem.quantity}`
    )
    dispatch(updateOrderItemsAction(response.data))
  } catch (err) {
    console.error(err)
  }
}
/**
 * REDUCER
 */
export default function(state = defaultOrderItem, action) {
  Object.freeze(state)
  switch (action.type) {
    case GET_ORDERITEM:
      return [...state, ...action.orderItems]

    case INCREASE_QUANTITY: {
      return state.map(orderItem => {
        if (orderItem.productId === action.orderItems) {
          return {...orderItem, quantity: orderItem.quantity + 1}
        } else {
          return orderItem
        }
      })
    }
    case DECREASE_QUANTITY: {
      return state.map(orderItem => {
        if (
          orderItem.productId === action.orderItems &&
          orderItem.quantity > 0
        ) {
          return {...orderItem, quantity: orderItem.quantity - 1}
        } else {
          return orderItem
        }
      })
    }

    case UPDATE_ORDERITEM: {
      const updatedOrderItem = state.map(orderItem => {
        if (
          orderItem.orderId === action.orderItems.orderId &&
          orderItem.productId === action.orderItems.productId
        ) {
          return action.orderItem
        } else {
          return orderItem
        }
      })
      return [...state, updatedOrderItem]
    }
    default:
      return state
  }
}
