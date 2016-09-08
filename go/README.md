# CV-injector (GO Version)

Comment compiler:

```
> mkdir build
> (cd build && export GOPATH=$PWD)
> go get github.com/nimajalali/go-force/force
> go get golang.org/x/net/html
```

Et pour finir:

```
go build CV-injector.go
```

Comment utiliser:

```
> ./CV-injector -h
Usage: CV-injector [flags] url...
  -brand string
    	Brand (IT, FORCE, DATA, FINANCE) (default "IT")
  -config string
    	Path to config file (default "config.json")
```
