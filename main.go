package main

import "flag"

const (
	defaultChainId = ""
	defaultInitialRpcs = ""
)

var (
	chainId string
	initialRpcs string
)

func init() {

	flag.StringVar(&initialRpcs, "initial-rpcs" defaultInitialRpcs, "A comma separated list of initial TM RPC addresses")
}

func main() {

}
